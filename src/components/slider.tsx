export default function Slider({
  val,
  setVal,
  title,
}: {
  val: number;
  setVal: (val: number) => void;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="range"
        min={0}
        max={255}
        onChange={(e) => setVal(parseInt(e.target.value))}
        value={val}
        className="w-[80px] main"
        style={{ appearance: "slider-vertical" } as any}
      />
      <div className="flex flex-col space-y-2 items-center justify-center">
        <h1>{title}</h1>
        <input
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value))}
          type="numeric"
          className="w-[60px] rounded-lg text-white text-center"
        />
      </div>
    </div>
  );
}
