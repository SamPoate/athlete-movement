import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import { useTimeout } from 'usehooks-ts';
import { MdDelete, MdEdit, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import Layout from '@components/Layout';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Textarea,
  Typography
} from '@material-tailwind/react';

type ICombinedClassAndWorkout = IClass & { workouts: Record<string, IClassWorkout> };

export const DashboardPage: React.FC = () => {
  const [classes, setClasses] = useState<Record<string, ICombinedClassAndWorkout>>({});
  const [activeClassId, setActiveClassId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  useTimeout(() => {
    setError('');
  }, 5000);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    const getClasses = async () => {
      const classesRef = collection(db, 'classes');
      const classes = await getDocs(classesRef);

      classes.docs.forEach(async doc => {
        const classData = doc.data() as IClass;
        const workouts = await getDocs(collection(db, 'classes', doc.id, 'workouts'));

        const workoutsData = Object.fromEntries(
          workouts.docs.map(workout => [workout.id, workout.data() as IClassWorkout])
        );

        setClasses(prevClasses => ({ ...prevClasses, [doc.id]: { ...classData, workouts: workoutsData } }));
      });
    };

    getClasses();
  }, []);

  const addClass = () => {
    const classId = uuid();
    const workoutId = uuid();
    const newClass = {
      name: '',
      published: false,
      workouts: {
        [workoutId]: {
          name: '',
          description: '',
          order: 1,
          isNew: true
        }
      },
      created_at: serverTimestamp(),
      isNew: true
    };

    setClasses(prevClasses => ({ ...prevClasses, [classId]: newClass }));
    setActiveClassId(classId);
  };

  const addWorkout = () => {
    setClasses(prevClasses => ({
      ...prevClasses,
      [activeClassId]: {
        ...prevClasses[activeClassId],
        workouts: {
          ...prevClasses[activeClassId].workouts,
          [uuid()]: {
            name: '',
            description: '',
            order: Object.keys(prevClasses[activeClassId].workouts).length + 1,
            isNew: true
          }
        }
      }
    }));
  };

  const deleteWorkout = (workoutId: string) => {
    setClasses(prevClasses => ({
      ...prevClasses,
      [activeClassId]: {
        ...prevClasses[activeClassId],
        workouts: {
          ...prevClasses[activeClassId].workouts,
          [workoutId]: { ...prevClasses[activeClassId].workouts[workoutId], isDeleted: true }
        }
      }
    }));
  };

  const cancelEdit = () => {
    setClasses(prevClasses => ({
      ...prevClasses,
      [activeClassId]: {
        ...prevClasses[activeClassId],
        workouts: Object.fromEntries(
          Object.entries(prevClasses[activeClassId].workouts).filter(([_, workout]) => !workout.isNew)
        )
      }
    }));

    setActiveClassId('');
  };

  const togglePublish = async (classId: string) => {
    try {
      await setDoc(
        doc(db, 'classes', classId),
        { published: !classes[classId].published, updated_at: serverTimestamp() },
        { merge: true }
      );

      setClasses(prevClasses => ({
        ...prevClasses,
        [classId]: {
          ...prevClasses[classId],
          published: !prevClasses[classId].published,
          updated_at: serverTimestamp()
        }
      }));
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      Object.keys(classes[classId].workouts).forEach(async workoutId => {
        await deleteDoc(doc(db, 'classes', classId, 'workouts', workoutId));
      });

      await deleteDoc(doc(db, 'classes', classId));

      setClasses(prevClasses => {
        const { [classId]: _, ...rest } = prevClasses;
        return rest;
      });
    } catch (error) {
      console.log(error);
      setError('Error removing class');
    }
  };

  const saveClass = async () => {
    try {
      const classesRef = collection(db, 'classes');
      let savedClass: Partial<ICombinedClassAndWorkout> = {};

      const originalClass = classes[activeClassId];
      const classData = {
        name: originalClass.name,
        published: originalClass.published,
        created_at: originalClass.created_at,
        updated_at: serverTimestamp(),
        updated_by: auth.currentUser?.uid
      };
      let classId = activeClassId;

      if (originalClass.isNew) {
        const response = await addDoc(classesRef, classData);
        classId = response.id;
      } else {
        await setDoc(doc(classesRef, classId), classData);
      }

      savedClass = originalClass;

      Object.keys(originalClass.workouts)
        .sort((a, b) => originalClass.workouts[a].order - originalClass.workouts[b].order)
        .forEach(async (workoutKey, index) => {
          const workout = originalClass.workouts[workoutKey];
          const workoutData = { name: workout.name, description: workout.description, order: index + 1 };
          let workoutId = workoutKey;

          if (workout.isDeleted) {
            await deleteDoc(doc(db, 'classes', classId, 'workouts', workoutId));
            return;
          }

          if (workout.isNew) {
            const response = await addDoc(collection(db, 'classes', classId, 'workouts'), workoutData);
            workoutId = response.id;
          } else {
            await setDoc(doc(collection(db, 'classes', classId, 'workouts'), workoutKey), workoutData);
          }

          savedClass = {
            ...savedClass,
            workouts: {
              ...(savedClass.workouts || {}),
              [workoutId]: workout
            }
          };
        });

      let newClasses = { ...classes };
      delete newClasses[activeClassId];

      newClasses = { ...newClasses, [classId]: savedClass as ICombinedClassAndWorkout };

      setClasses(newClasses);
      setActiveClassId('');
    } catch (error) {
      console.log(error);
      setError('Error saving class');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Athlete Movement | Dashboard</title>
      </Head>
      {error && (
        <div className='fixed w-full p-5'>
          <Alert color='red'>{error}</Alert>
        </div>
      )}
      <div className='flex flex-col p-5 gap-5'>
        {classes[activeClassId] ? (
          <Card>
            <CardHeader
              className='mb-4 grid h-10 place-items-center'
              variant='gradient'
              color='blue'
              floated={false}
            >
              <Typography color='white' variant='h5'>
                Class Editor
              </Typography>
            </CardHeader>
            <CardBody className='flex flex-col gap-5'>
              <Input
                label='Class Name'
                value={classes[activeClassId].name}
                onChange={({ target }) =>
                  setClasses({
                    ...classes,
                    [activeClassId]: {
                      ...classes[activeClassId],
                      name: target.value
                    }
                  })
                }
                autoFocus={!classes[activeClassId].name.length}
              />
              {Object.keys(classes[activeClassId].workouts)
                .sort(
                  (a, b) => classes[activeClassId].workouts[a].order - classes[activeClassId].workouts[b].order
                )
                .map(
                  (workoutId, index, original) =>
                    !classes[activeClassId].workouts[workoutId].isDeleted && (
                      <div key={index} className='flex flex-col lg:flex-row gap-5'>
                        <Textarea
                          label='Workout Name'
                          value={classes[activeClassId].workouts[workoutId].name}
                          onChange={({ target }) =>
                            setClasses(prevClasses => ({
                              ...prevClasses,
                              [activeClassId]: {
                                ...prevClasses[activeClassId],
                                workouts: {
                                  ...prevClasses[activeClassId].workouts,
                                  [workoutId]: {
                                    ...prevClasses[activeClassId].workouts[workoutId],
                                    name: target.value
                                  }
                                }
                              }
                            }))
                          }
                        />
                        <Textarea
                          label='Workout Description'
                          value={classes[activeClassId].workouts[workoutId].description}
                          onChange={({ target }) =>
                            setClasses(prevClasses => ({
                              ...prevClasses,
                              [activeClassId]: {
                                ...prevClasses[activeClassId],
                                workouts: {
                                  ...prevClasses[activeClassId].workouts,
                                  [workoutId]: {
                                    ...prevClasses[activeClassId].workouts[workoutId],
                                    description: target.value
                                  }
                                }
                              }
                            }))
                          }
                        />
                        <div className='flex flex-row-reverse lg:flex-col gap-2 mt-[-15px] lg:mt-0'>
                          <IconButton
                            size='sm'
                            variant='gradient'
                            onClick={() => {
                              setClasses(prevClasses => ({
                                ...prevClasses,
                                [activeClassId]: {
                                  ...prevClasses[activeClassId],
                                  workouts: {
                                    ...prevClasses[activeClassId].workouts,
                                    [original[index - 1]]: {
                                      ...prevClasses[activeClassId].workouts[original[index - 1]],
                                      order: prevClasses[activeClassId].workouts[original[index - 1]].order + 1
                                    },
                                    [workoutId]: {
                                      ...prevClasses[activeClassId].workouts[workoutId],
                                      order: prevClasses[activeClassId].workouts[workoutId].order - 1
                                    }
                                  }
                                }
                              }));
                            }}
                            disabled={!index}
                          >
                            <MdArrowUpward size={20} />
                          </IconButton>
                          <IconButton
                            size='sm'
                            variant='gradient'
                            onClick={() => {
                              setClasses(prevClasses => ({
                                ...prevClasses,
                                [activeClassId]: {
                                  ...prevClasses[activeClassId],
                                  workouts: {
                                    ...prevClasses[activeClassId].workouts,
                                    [workoutId]: {
                                      ...prevClasses[activeClassId].workouts[workoutId],
                                      order: prevClasses[activeClassId].workouts[workoutId].order + 1
                                    },
                                    [original[index + 1]]: {
                                      ...prevClasses[activeClassId].workouts[original[index + 1]],
                                      order: prevClasses[activeClassId].workouts[original[index + 1]].order - 1
                                    }
                                  }
                                }
                              }));
                            }}
                            disabled={index === original.length - 1}
                          >
                            <MdArrowDownward size={20} />
                          </IconButton>
                          <IconButton
                            size='sm'
                            variant='gradient'
                            color='red'
                            className='mr-auto lg:mr-0'
                            onClick={() => deleteWorkout(workoutId)}
                          >
                            <MdDelete size={20} />
                          </IconButton>
                        </div>
                      </div>
                    )
                )}
              <div className='flex justify-between gap-3 lg:gap-5'>
                <Button variant='gradient' onClick={addWorkout}>
                  Add Row
                </Button>
                <div className='flex gap-3'>
                  <Button variant='gradient' color='red' onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button variant='gradient' color='green' onClick={saveClass}>
                    Save Class
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader
              className='mb-4 grid h-10 place-items-center'
              variant='gradient'
              color='blue'
              floated={false}
            >
              <Typography color='white' variant='h5'>
                Your Classes
              </Typography>
            </CardHeader>
            <CardBody className='flex flex-col gap-5'>
              {Object.keys(classes)
                .sort((a, b) => classes[a].name.localeCompare(classes[b].name))
                .map(classId => (
                  <div key={classId}>
                    <div key={classId} className='flex items-center justify-between gap-5'>
                      <Typography variant='h3'>{classes[classId].name}</Typography>
                      <div className='flex items-center gap-2'>
                        <IconButton variant='gradient' color='green' onClick={() => togglePublish(classId)}>
                          {classes[classId].published ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                        </IconButton>
                        <IconButton variant='gradient' onClick={() => setActiveClassId(classId)}>
                          <MdEdit size={20} />
                        </IconButton>
                        <IconButton variant='gradient' color='red' onClick={() => deleteClass(classId)}>
                          <MdDelete size={20} />
                        </IconButton>
                      </div>
                    </div>
                    <div className='flex items-start gap-5'>
                      <div className='flex-1 max-w-xs'>
                        <Typography variant='h5'>Name</Typography>
                        {Object.keys(classes[classId].workouts).map(
                          workoutId =>
                            !classes[classId].workouts[workoutId].isDeleted && (
                              <div key={workoutId}>
                                <Typography>{classes[classId].workouts[workoutId].name}</Typography>
                              </div>
                            )
                        )}
                      </div>
                      <div>
                        <Typography variant='h5'>Description</Typography>
                        {Object.keys(classes[classId].workouts).map(
                          workoutId =>
                            !classes[classId].workouts[workoutId].isDeleted && (
                              <div key={workoutId}>
                                <Typography>{classes[classId].workouts[workoutId].description}</Typography>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div className='flex justify-end gap-5'>
                <Button variant='gradient' onClick={addClass}>
                  Add Class
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
