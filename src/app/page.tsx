"use client";

import { Button } from "@mantine/core";
import Link from "next/link";

export default function AudioGen() {
  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="flex items-center justify-center w-[100vw] h-[100vh] flex-col">
        <h1 className="text-5xl">
          <strong className="text-green-400">Advanced</strong> Lighting Control{" "}
        </h1>
        <p>
          Bring your roblox concert, plays, musicals and shows to life with our
          advanced DMX based open source lighting control system.
        </p>

        <Link href="/main">
          <Button className="mt-8">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
