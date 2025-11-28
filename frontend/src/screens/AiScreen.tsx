import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../api/endpoints';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AiScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-tasks-full'],
    queryFn: () => aiApi.listTasks({ limit: 50 }),
    refetchInterval: 20_000,
  });

  if (isLoading) {
    return <p className="p-6 text-white/60">Загрузка AI задач...</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {data?.map((task) => (
        <Card key={task.id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">#{task.id}</p>
              <p className="text-sm text-white/60">{new Date(task.createdAt).toLocaleString()}</p>
            </div>
            <Badge tone={task.status === 'COMPLETED' ? 'success' : task.status === 'FAILED' ? 'danger' : 'warning'}>
              {task.status}
            </Badge>
          </div>
          <p className="mt-4 text-sm text-white/60">{task.prompt}</p>
          {task.result && <p className="mt-4 text-base text-white">{task.result}</p>}
        </Card>
      ))}
    </div>
  );
};

export default AiScreen;


