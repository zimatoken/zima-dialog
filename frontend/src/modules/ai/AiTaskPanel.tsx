import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../../api/endpoints';
import { Badge } from '../../components/ui/badge';

export const AiTaskPanel = () => {
  const { data } = useQuery({
    queryKey: ['ai-tasks'],
    queryFn: () => aiApi.listTasks({ limit: 10 }),
    refetchInterval: 15_000,
  });

  return (
    <aside className="hidden w-96 border-l border-white/10 bg-abyss/60 p-4 text-white/80 lg:block">
      <h3 className="mb-4 text-lg font-semibold text-white">AI Monitor</h3>
      <div className="space-y-3">
        {data?.map((task) => (
          <div key={task.id} className="rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">#{task.id.slice(0, 6)}</p>
              <Badge tone={task.status === 'COMPLETED' ? 'success' : task.status === 'FAILED' ? 'danger' : 'warning'}>
                {task.status}
              </Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-white/60">{task.prompt}</p>
            {task.result && <p className="mt-2 text-sm text-white">{task.result.slice(0, 120)}...</p>}
          </div>
        ))}
        {!data?.length && <p className="text-sm text-white/40">AI задачи отсутствуют.</p>}
      </div>
    </aside>
  );
};


