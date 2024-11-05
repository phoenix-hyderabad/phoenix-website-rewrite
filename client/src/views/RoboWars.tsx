const Robowars = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 bg-[#EC2023] p-8 text-center">
      <div className="flex flex-col gap-4">
        <div className="relative flex flex-col text-center">
          <h1 className="font-atom relative text-[10rem] text-black">ROBO</h1>
          <div className="font-miyoshi absolute left-0 top-0 flex h-full w-full -rotate-12 items-center justify-center text-8xl text-[#EC2023] [text-shadow:_-1px_1px_0_#000,1px_1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
            WARS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Robowars;
