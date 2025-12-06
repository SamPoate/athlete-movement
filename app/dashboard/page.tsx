'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { ArrowUp, ArrowDown, Trash2, Edit, Eye, EyeOff, Plus } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import Layout from '@components/Layout';
import { Button } from '@components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { toast } from 'sonner';

type ICombinedClassAndWorkout = IClass & { workouts: Record<string, IClassWorkout> };

export default function DashboardPage() {
  const [classes, setClasses] = useState<Record<string, ICombinedClassAndWorkout>>({});
  const [activeClassId, setActiveClassId] = useState<string>('');

  const router = useRouter();

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
      toast.error('Something went wrong');
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
      toast.error('Error removing class');
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
      toast.error('Error saving class');
    }
  };

  return (
    <Layout>
      <div className='flex flex-col p-2 lg:p-5 gap-5'>
        {classes[activeClassId] ? (
          <Card className='shadow-xl border-t-4 border-t-neutral-800 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white py-6 relative overflow-hidden'>
              <CardTitle className='text-center text-3xl font-bold tracking-tight relative z-10'>Class Editor</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-6 pt-6'>
              <div className='space-y-2'>
                <Label htmlFor='class-name'>Class Name</Label>
                <Input
                  id='class-name'
                  className='text-[1rem]'
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
              </div>
              {Object.keys(classes[activeClassId].workouts)
                .sort(
                  (a, b) => classes[activeClassId].workouts[a].order - classes[activeClassId].workouts[b].order
                )
                .map(
                  (workoutId, index, original) =>
                    !classes[activeClassId].workouts[workoutId].isDeleted && (
                      <div key={index} className='flex flex-col lg:flex-row gap-5'>
                        <div className='flex-1 space-y-2'>
                          <Label htmlFor={`workout-name-${index}`}>Workout Name</Label>
                          <Textarea
                            id={`workout-name-${index}`}
                            className='text-[1rem]'
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
                        </div>
                        <div className='flex-1 space-y-2'>
                          <Label htmlFor={`workout-description-${index}`}>Workout Description</Label>
                          <Textarea
                            id={`workout-description-${index}`}
                            className='text-[1rem]'
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
                        </div>
                        <div className='flex flex-row-reverse lg:flex-col gap-2 mt-[-15px] lg:mt-0'>
                          <Button
                            variant='ghost'
                            size='icon'
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
                            <ArrowUp className='h-5 w-5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
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
                            <ArrowDown className='h-5 w-5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='mr-auto lg:mr-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                            onClick={() => deleteWorkout(workoutId)}
                          >
                            <Trash2 className='h-5 w-5' />
                          </Button>
                        </div>
                      </div>
                    )
                )}
              <Separator className='my-2' />
              <div className='flex justify-between gap-3 lg:gap-5'>
                <Button onClick={addWorkout} variant='outline'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Row
                </Button>
                <div className='flex gap-3'>
                  <Button variant='destructive' onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button variant='default' className='bg-green-600 hover:bg-green-700' onClick={saveClass}>
                    Save Class
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className='shadow-xl border-t-4 border-t-neutral-800 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white py-6 relative overflow-hidden'>
              <CardTitle className='text-center text-3xl font-bold tracking-tight relative z-10'>Classes</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-6 pt-6'>
              {Object.keys(classes)
                .sort((a, b) => classes[a].name.localeCompare(classes[b].name))
                .map(classId => (
                  <div key={classId} className='border rounded-lg p-4 hover:bg-neutral-50 transition-colors'>
                    <div className='flex items-center justify-between gap-5 mb-3'>
                      <div className='flex items-center gap-3'>
                        <h3 className='text-2xl font-bold'>{classes[classId].name}</h3>
                        {classes[classId].published && (
                          <Badge variant='default' className='bg-green-600'>Published</Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-violet-600 hover:text-violet-700 hover:bg-violet-50'
                          onClick={() => togglePublish(classId)}
                          title={classes[classId].published ? 'Unpublish' : 'Publish'}
                        >
                          {classes[classId].published ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}
                        </Button>
                        <Button 
                          variant='ghost' 
                          size='icon'
                          className='hover:bg-neutral-100'
                          onClick={() => setActiveClassId(classId)}
                          title='Edit'
                        >
                          <Edit className='h-5 w-5' />
                        </Button>
                        <Button 
                          variant='ghost' 
                          size='icon' 
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                          onClick={() => deleteClass(classId)}
                          title='Delete'
                        >
                          <Trash2 className='h-5 w-5' />
                        </Button>
                      </div>
                    </div>
                    <Separator className='my-3' />
                    <div className='flex items-start gap-5'>
                      <div className='flex-1 max-w-xs'>
                        <h5 className='text-sm font-semibold text-neutral-600 mb-2 uppercase tracking-wide'>Name</h5>
                        {Object.keys(classes[classId].workouts).map(
                          workoutId =>
                            !classes[classId].workouts[workoutId].isDeleted && (
                              <div key={workoutId}>
                                <p className='text-sm'>{classes[classId].workouts[workoutId].name}</p>
                              </div>
                            )
                        )}
                      </div>
                      <div className='flex-1'>
                        <h5 className='text-sm font-semibold text-neutral-600 mb-2 uppercase tracking-wide'>Description</h5>
                        {Object.keys(classes[classId].workouts).map(
                          workoutId =>
                            !classes[classId].workouts[workoutId].isDeleted && (
                              <div key={workoutId}>
                                <p className='text-sm'>{classes[classId].workouts[workoutId].description}</p>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <Separator className='my-2' />
              <div className='flex justify-end gap-5'>
                <Button onClick={addClass} size='lg'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Class
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
