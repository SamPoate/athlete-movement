import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MdEdit } from 'react-icons/md';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import Layout from '@components/Layout';
import { Button, Card, CardBody, CardHeader, IconButton, Input, Typography } from '@material-tailwind/react';

interface DashboardPageProps {}

interface IClassWorkout {
  name: string;
  description: string;
}

interface IClass {
  id: string;
  name: string;
  workouts: IClassWorkout[];
}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [className, setClassName] = useState<string>('');
  const [exercises, setExercises] = useState<IClassWorkout[]>([{ name: '', description: '' }]);

  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const getClasses = async () => {
      const classes = await getDocs(collection(db, 'classes'));

      classes.docs.forEach(async doc => {
        const classData = doc.data() as IClass;
        const workouts = await getDocs(collection(db, 'classes', doc.id, 'workouts'));

        const workoutsData = workouts.docs.map(workout => workout.data()) as IClassWorkout[];

        setClasses(prevClasses => [...prevClasses, { ...classData, id: doc.id, workouts: workoutsData }]);
      });
    };

    getClasses();
  }, []);

  const addRow = () => {
    setExercises([...exercises, { name: '', description: '' }]);
  };

  const editRow = (id: string) => {};

  const saveClass = () => {
    // save class
  };

  return (
    <Layout>
      <Head>
        <title>Athlete Movement | Dashboard</title>
      </Head>
      <div className='flex flex-col px-5 py-10 gap-5'>
        <Card>
          <CardHeader
            className='mb-4 grid h-10 place-items-center'
            variant='gradient'
            color='blue'
            floated={false}
          >
            <Typography color='white' variant='h5'>
              Dashboard
            </Typography>
          </CardHeader>
          <CardBody className='flex flex-col gap-5'>
            <Typography>Add a class below</Typography>
            <Input label='Class Name' value={className} onChange={({ target }) => setClassName(target.value)} />
            {exercises.map((exercise, index) => (
              <div key={index} className='flex gap-5'>
                <Input
                  label='Exercise Name'
                  value={exercises[index].name}
                  onChange={({ target }) =>
                    setExercises(
                      exercises.map((exercise, i) =>
                        i === index ? { ...exercise, name: target.value } : exercise
                      )
                    )
                  }
                />
                <Input
                  label='Exercise Description'
                  value={exercises[index].description}
                  onChange={({ target }) =>
                    setExercises(
                      exercises.map((exercise, i) =>
                        i === index ? { ...exercise, description: target.value } : exercise
                      )
                    )
                  }
                />
              </div>
            ))}
            <div className='flex justify-end gap-5'>
              <Button variant='gradient' onClick={addRow}>
                Add Row
              </Button>
              <Button variant='gradient' color='green' onClick={saveClass}>
                Save Class
              </Button>
            </div>
          </CardBody>
        </Card>
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
            {classes.map(c => (
              <div key={c.id} className='flex items-center gap-5'>
                <Typography variant='h3'>{c.name}</Typography>
                <IconButton variant='gradient' onClick={() => editRow(c.id)}>
                  <MdEdit size={20} />
                </IconButton>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
