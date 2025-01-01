interface RequestStatusProps {
  status: string;
  message?: string;
}

export function RequestStatus({ status, message }: RequestStatusProps) {
  return (
    <div>
      <p className="text-gray-600">
        Statut : <span className={`font-medium ${
          status === 'pending' ? 'text-yellow-600' :
          status === 'approved' ? 'text-green-600' :
          'text-red-600'
        }`}>
          {status === 'pending' ? 'En attente' :
           status === 'approved' ? 'Approuvée' :
           status === 'cancelled' ? 'Annulée' :
           'Rejetée'}
        </span>
      </p>
      {message && (
        <p className="text-gray-600 mt-2">
          Message : {message}
        </p>
      )}
    </div>
  );
}