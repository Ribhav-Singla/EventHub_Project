function Spinner() {
  return (
    <div>
      <div className="text-center bg-[#000a26] flex flex-col justify-center items-center py-20">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
        <h2 className="text-white mt-2">Loading...</h2>
        <p className="text-white mt-2">Your adventure is about to begin</p>
      </div>
    </div>
  );
}

export default Spinner;
