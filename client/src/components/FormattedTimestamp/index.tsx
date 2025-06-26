import { FormattedTimestampProps } from './types';

export default function FormattedTimestamp({ date }: FormattedTimestampProps) {
  const d = new Date(date);
  const formattedDate = d.toLocaleDateString();
  const formattedTime = d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="text-right shrink-0">
      <time className="text-xs text-gray-400 font-medium">{formattedDate}</time>
      <div className="text-xs text-gray-500 mt-1">{formattedTime}</div>
    </div>
  );
}