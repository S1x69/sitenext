import { redirect, permanentRedirect } from 'next/navigation';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CotacoesRedirect() {
  permanentRedirect('/categoria/cotacoes');
}
