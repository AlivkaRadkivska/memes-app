import { signup } from '@/server/services/auth-service';
import { useMutation } from '@tanstack/react-query';

export const useSignup = () =>
  useMutation({
    mutationFn: signup,
  });
