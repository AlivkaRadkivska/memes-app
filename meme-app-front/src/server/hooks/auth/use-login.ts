import { login } from '@/server/services/auth-service';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
