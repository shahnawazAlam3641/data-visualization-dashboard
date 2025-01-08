const Loading = () => {
  return (
    <div className="absolute top-5 bg-white rounded-md p-3 flex justify-center items-center gap-4 shadow-xl left-1/2 -translate-x-1/2">
      <div className="h-5 w-5 rounded-full border-[4px] border-r-gray-500 animate-spin "></div>
      <span>Please Wait</span>
    </div>
  );
};

export default Loading;
