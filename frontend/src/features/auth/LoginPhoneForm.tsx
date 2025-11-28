import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { useAuthFlows } from '../../hooks/useAuth';

export const LoginPhoneForm = () => {
  const [phone, setPhone] = useState('+79990000000');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const { sendCode, verifyCode } = useAuthFlows();

  const handlePhoneSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendCode.mutate(phone, {
      onSuccess: () => setStep('code'),
    });
  };

  const handleCodeSubmit = (event: FormEvent) => {
    event.preventDefault();
    verifyCode.mutate({
      phone,
      code,
      deviceInfo: { deviceId: 'web-' + navigator.userAgent, platform: 'web', appVersion: '0.1.0' },
    });
  };

  return (
    <Card glass className="space-y-6">
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <p className="text-white/80">Введите номер телефона для получения кода доступа.</p>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7999..." type="tel" />
          <Button className="w-full" type="submit" isLoading={sendCode.isPending}>
            Получить код
          </Button>
        </form>
      )}
      {step === 'code' && (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <p className="text-white/80">
            Введите код из SMS. Если код не пришёл, попробуйте снова через {sendCode.data?.data?.ttl ?? 300} секунд.
          </p>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX" maxLength={6} />
          <Button className="w-full" type="submit" isLoading={verifyCode.isPending}>
            Войти
          </Button>
        </form>
      )}
    </Card>
  );
};


