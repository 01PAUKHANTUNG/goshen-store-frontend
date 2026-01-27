import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const StripePaymentForm = ({ clientSecret, orderId, backendUrl, token, setCartItems, navigate, amount, currency }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        const processingToast = toast.loading("Confirming your payment...");

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.update(processingToast, { render: result.error.message, type: "error", isLoading: false, autoClose: 3000 });
                setIsProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 1. Verify Payment on Backend immediately (Fallback for webhooks)
                    await axios.post(backendUrl + '/api/order/verify-stripe', { orderId, success: true }, { headers: { token } });

                    // 2. Success UI
                    setCartItems([]);
                    toast.update(processingToast, { render: "Payment Successful!", type: "success", isLoading: false, autoClose: 3000 });
                    navigate('/orders');
                }
            }
        } catch (error) {
            console.error("Payment Confirmation Error:", error);
            toast.update(processingToast, { render: "An unexpected error occurred.", type: "error", isLoading: false, autoClose: 3000 });
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'Inter, sans-serif',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Card Details</label>
                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            <button
                disabled={!stripe || isProcessing}
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95
                    ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isProcessing ? "Processing..." : `Pay ${currency}${amount.toFixed(2)} Now`}
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">Powered by Stripe • Secure Transaction</p>
        </form>
    );
};

export default StripePaymentForm;
