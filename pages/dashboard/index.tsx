import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import { useTimeout } from 'usehooks-ts';
import { MdDelete, MdEdit } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDocs,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
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

interface DashboardPageProps {}

interface IClassWorkout {
  name: string;
  description: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface IClass {
  name: string;
  published: boolean;
  workouts: Record<string, IClassWorkout>;
  created_at: FieldValue;
  updated_at?: FieldValue;
  isNew?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const [classes, setClasses] = useState<Record<string, IClass>>({});
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
        workouts: { ...prevClasses[activeClassId].workouts, [uuid()]: { name: '', description: '', isNew: true } }
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
      let savedClass: Partial<IClass> = {};

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

      Object.keys(originalClass.workouts).forEach(async workoutKey => {
        const workout = originalClass.workouts[workoutKey];
        const workoutData = { name: workout.name, description: workout.description };
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

      newClasses = { ...newClasses, [classId]: savedClass as IClass };

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
      <div className='flex flex-col px-5 py-10 gap-5'>
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
              {Object.keys(classes[activeClassId].workouts).map(
                (workoutId, index) =>
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
                      <div>
                        <IconButton variant='gradient' color='red' onClick={() => deleteWorkout(workoutId)}>
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
