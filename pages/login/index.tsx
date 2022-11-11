import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTimeout } from 'usehooks-ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@lib/firebase';
import Layout from '@components/Layout';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Typography,
  CardFooter,
  Button,
  Alert
} from '@material-tailwind/react';

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  useTimeout(() => {
    setError('');
  }, 5000);

  useEffect(() => {
    if (auth.currentUser) {
      router.replace('/dashboard');
    }
  }, [router]);

  const signIn = async () => {
    if (email.includes('@') && password.length > 5) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/dashboard');
      } catch (error) {
        console.log(error);
        setError('Invalid email or password');
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Athlete Movement | Login</title>
      </Head>
      {error && (
        <div className='fixed w-full p-5'>
          <Alert color='red'>{error}</Alert>
        </div>
      )}
      <div className='flex justify-center items-center flex-grow pb-20'>
        <Card className='w-96'>
          <CardHeader variant='gradient' color='blue' className='mb-4 grid h-28 place-items-center'>
            <Typography variant='h3' color='white'>
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className='flex flex-col gap-4'>
            <Input
              label='Email'
              size='lg'
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              error={!!error}
            />
            <Input
              label='Password'
              size='lg'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type='password'
              error={!!error}
            />
          </CardBody>
          <CardFooter className='pt-0'>
            <Button variant='gradient' fullWidth onClick={signIn}>
              Sign In
            </Button>
            <Typography variant='small' className='mt-6 flex justify-center'>
              Don&apos;t have an account?
              <Typography as='a' href='#signup' variant='small' color='blue' className='ml-1 font-bold'>
                Sign up
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
