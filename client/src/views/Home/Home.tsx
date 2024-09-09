import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import { Button } from "@/components/ui/button";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 p-8 text-center">
      <div className="flex gap-4">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
    </div>
  );
}

export default Home;
