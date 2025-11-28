import React from 'react';
import { FileCard } from '../components/ui/FileCard';

const mockFiles = [
  { id: '1', title: 'Проект ZIMA.pdf', size: '2.3 MB', thumb: undefined },
  { id: '2', title: 'Дизайн система.fig', size: '1.8 MB', thumb: undefined },
  { id: '3', title: 'Презентация.pptx', size: '4.1 MB', thumb: undefined },
  { id: '4', title: 'Отчет за ноябрь.xlsx', size: '890 KB', thumb: undefined },
  { id: '5', title: 'Документация API.md', size: '156 KB', thumb: undefined },
  { id: '6', title: 'Бэклог задач.csv', size: '34 KB', thumb: undefined },
];

export const FilesPage: React.FC = () => {
  return (
    <div className="p-6 flex-1">
      <h2 className="text-2xl font-bold text-snow-white mb-6">Файлы и медиа</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockFiles.map((file) => (
          <FileCard
            key={file.id}
            title={file.title}
            size={file.size}
            thumb={file.thumb}
            onOpen={() => console.log('Open file:', file.title)}
          />
        ))}
      </div>
    </div>
  );
};