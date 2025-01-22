import { ApprovalRequest } from "../approval-requests/types";

interface RequestHeaderProps {
  request: ApprovalRequest;
}

export function RequestHeader({ request }: RequestHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {request.company_name}
      </h2>
      <p className="text-gray-600">
        {request.first_name} {request.last_name}
      </p>
    </div>
  );
}