export interface AuthButtonProps {
  isSubmitting: boolean;
  buffer: string;
  buffering: string;
  className?: string;
}

export const AuthButton = ({ isSubmitting, buffer, buffering, className }: Readonly<AuthButtonProps>) => {
  return (
    <button
      type="submit"
          disabled={isSubmitting}
          className={`w-full  text-white py-2 rounded  transition disabled:opacity-50 ${className || ''}`}
        >
          {isSubmitting ? buffering : buffer}
        </button>
    )
}