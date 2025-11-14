export default function TasksLoading() {
  return (
    <div className="flex justify-center py-20 text-muted-foreground">
      <div className="text-center">
        <div className="relative h-10 w-10 mb-4 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p>Loading tasks...</p>
      </div>
    </div>
  );
}
