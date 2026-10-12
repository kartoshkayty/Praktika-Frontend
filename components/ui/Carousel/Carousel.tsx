import { ReactElement, useState } from "react";
import { PlateProps } from "./Plate";
import Arrow from "../../../assets/Arrow.svg";
import Image from "next/image";

interface CarouselProps {
  gap: number;
  elementWidth: number;
  displayElementsNumber: number;
  children: ReactElement<PlateProps>[];
  className?: string;
}

export default function Carousel({
  children,
  elementWidth,
  displayElementsNumber,
  gap,
  className,
}: CarouselProps) {
  const carouselWidth =
    elementWidth * displayElementsNumber + gap * (displayElementsNumber - 1);

  const [step, setStep] = useState(0);
  const maxSteps = Math.max(0, children.length - displayElementsNumber);
  const stepWidth = elementWidth + gap;

  const nextStep = () => {
    if (step + 1 > maxSteps) {
      setStep(0);
      return;
    }

    setStep(step + 1);
  };

  const backStep = () => {
    if (step === 0) {
      setStep(maxSteps);
      return;
    }

    setStep(step - 1);
  };

  return (
    <div
      className={`relative flex items-center${className ? " " + className : ""}`}
    >
      <button
        className={`absolute z-10 group${maxSteps === 0 ? " hidden" : ""}`}
        style={{ left: `-${33 / 2}px` }}
        onClick={() => backStep()}
      >
        <div className="w-8.25 h-8.25 flex justify-center items-center rounded-full bg-black opacity-50 group-hover:opacity-100 transition-opacity duration-250 ease-out">
          <Image src={Arrow} alt="arrow" className="rotate-180" />
        </div>
      </button>
      <button
        className={`absolute z-10 group${maxSteps === 0 ? " hidden" : ""}`}
        style={{ left: `${carouselWidth - 33 / 2}px` }}
        onClick={() => nextStep()}
      >
        <div className="w-8.25 h-8.25 flex justify-center items-center rounded-full bg-black opacity-50 group-hover:opacity-100 transition-opacity duration-250 ease-out">
          <Image src={Arrow} alt="arrow" />
        </div>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxWidth: `${carouselWidth}px`,
        }}
      >
        <div
          className="flex transition-all ease-out duration-350"
          style={{ transform: `translateX(-${stepWidth * step}px)` }}
        >
          {children
            .sort(
              (a, b) =>
                b.props.data.createdAt.getTime() -
                a.props.data.createdAt.getTime(),
            )
            .map((e, index) => (
              <div
                key={e.props.data.id}
                style={index > 0 ? { marginLeft: `${gap}px` } : {}}
              >
                {e}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
