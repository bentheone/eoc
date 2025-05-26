import { useContext } from 'react';
import { AlertContext } from '../../context/AlertContext';

const Alert = () => {
  const { alerts } = useContext(AlertContext);

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
      {alerts.length > 0 &&
        alerts.map(alert => (
          <div
            key={alert.id}
            className={`mb-4 p-4 rounded shadow-md ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                : alert.type === 'error'
                ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                : alert.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
                : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}
          >
            {alert.msg}
          </div>
        ))}
    </div>
  );
};

export default Alert;
