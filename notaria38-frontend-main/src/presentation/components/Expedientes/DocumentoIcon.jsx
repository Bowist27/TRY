import { File, Eye } from 'lucide-react';

export default function DocumentoIcon({ url }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-14 h-16 rounded-md flex items-center justify-center">
        <File
          size={50}
          className="text-orange-400"
          style={{
            color: url ? '#9C541C' : '#B5B3AE',
          }}
          fill={url ? '#D07024' : '#CCCAC4'}
        />
      </div>
      {url && (
        <div className="absolute bottom-1 right-1
        bg-orange-400 p-1 rounded-full shadow-md">
          <Eye size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}