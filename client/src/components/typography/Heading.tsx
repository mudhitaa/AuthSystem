interface HeadingProps {
  text: string;
  subtitle?: string;
  classname?: string;
}
interface SubHeadingProps {
  text: string;
  classname?: string;
}

export const Heading = ({ text, subtitle, classname = '' }: Readonly<HeadingProps>) => {
  return (
    <div className="text-center mb-6">
      <h1 className={`text-3xl font-bold ${classname}`}>{text}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}


export const SubHeading = ({ text, classname = ''}: Readonly<SubHeadingProps>) => {
  return (
    <h2 className={`text-xl font-semibold text-slate-900 ${classname}`}>{text}</h2>
  );
}