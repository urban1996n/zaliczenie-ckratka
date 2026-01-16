import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'app/components/ui/form';
import { Input } from 'app/components/ui/input';
import { useAuth } from 'hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from 'app/components/ui/card';

interface AuthFormProps {
  isLogin: boolean;
}

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export const AuthForm = ({ isLogin }: AuthFormProps) => {
  const { login, register } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLogin) {
      await login(values);
    } else {
      await register(values);
      // after registration, log in the user automatically
      await login(values);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
