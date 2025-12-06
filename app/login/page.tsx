'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@lib/firebase';
import Layout from '@components/Layout';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Button } from '@components/ui/button';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

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
        toast.error('Invalid email or password');
      }
    } else {
      toast.error('Please enter valid email and password');
    }
  };

  return (
    <Layout>
      <div className='flex justify-center items-center flex-grow pb-20'>
        <Card className='w-96'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>Sign In</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && signIn()}
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button className='w-full' onClick={signIn}>
              Sign In
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <a href='#signup' className='text-primary font-bold hover:underline'>
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
