// components/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // A dónde redirigir después del pago
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // Solo llega aquí si hay error inmediato
    // (si el pago es exitoso, redirige al return_url)
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message ?? 'Ocurrió un error');
    } else {
      setMessage('Error inesperado. Intenta de nuevo.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        style={{ marginTop: '1rem' }}
      >
        {isLoading ? 'Procesando...' : 'Pagar'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}