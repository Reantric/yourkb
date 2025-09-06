import { CHANGES } from "./changelog";

export default async function Changelog() {
  return (
    <div className="gap-6 px-4">
      <ul className="float-left space-y-4 list-disc">
        {CHANGES.map((c, index) => (
          <li key={index}>
            <h2 className="font-bold text-xl">
              {c.month}-{c.day}-{c.year}
            </h2>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
