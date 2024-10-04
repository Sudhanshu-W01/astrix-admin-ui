import moment from "moment";
import React, { useState, useEffect } from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useSelector } from "react-redux";

interface myProp {
  onChange: (prop: any) => void;
  min?: any;
  max?: any;
  date?: any;
}

interface DateInfo {
  day: number | null;
  month: string;
  year: number | null;
}

const Calendar: React.FC<myProp> = ({ onChange, min, max, date }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  let prevDate = new Date(date);
  const [days, setDays] = useState<number[]>([]);
  const [prevDates, setPrevDates] = useState<number[]>();
  const [nextDates, setNextDates] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateInfo>(
    date
      ? {
          year: prevDate.getFullYear(),
          month: prevDate.toLocaleString("default", { month: "long" }),
          day: prevDate.getDate(),
        }
      : { year: null, month: "", day: null },
  );

  // for day
  const getDaysInMonth = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  };

  //for month
  const getFirstDayOfMonth = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  //for year
  const generateMonthDays = () => {
    const totalDays = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const changeMonth = (increment: any) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const daysArray = generateMonthDays();

  const handleDateSelect = (day: any) => {
    // Set the new selected date
    const newSelectedDate: DateInfo = {
      day: day,
      month: currentDate.toLocaleString("default", { month: "long" }),
      year: currentDate.getFullYear(),
    };

    setSelectedDate(newSelectedDate);
    const currentDateCopy: any = new Date(currentDate);
    currentDateCopy.setDate(day);
    let newDate = moment(currentDateCopy, "YYYY-MM-DD").format("L");
    if (currentDateCopy) {
      onChange(currentDateCopy);
    }
  };

  const getDayByDate = (year: number, month: number, date: number) => {
    const currDay = new Date(year, month - 1, date).getDay();
    return currDay;
  };

  const getDaysInMonths = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    if (currentDate.getFullYear() && currentDate.getMonth() + 1) {
      const days = getDaysInMonths(currentDate.getFullYear(), currentDate.getMonth() + 1);
      const d = [];
      for (let i = 1; i <= days; i++) {
        d.push(i);
      }
      setDays(d);
    }
    const daysToSkip = getDayByDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    getNextDates(daysToSkip);
  }, [currentDate]);

  const getPrevDates = (skip: number) => {
    const prevDates = [];
    let lastDate = getDaysInMonths(currentDate.getFullYear(), currentDate.getMonth());
    for (let i = 0; i < skip; i++) {
      prevDates.push(lastDate - skip + 1);
      lastDate++;
    }
    setPrevDates(prevDates);
    return prevDates;
  };

  const getNextDates = (skip: number) => {
    const prevDates = getPrevDates(skip);
    const monthDays = getDaysInMonths(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const nextDatesLength =
      prevDates.length + monthDays <= 35
        ? 35 - monthDays - prevDates.length
        : 42 - monthDays - prevDates.length;
    const nextDates = [];
    for (let i = 1; i <= nextDatesLength; i++) {
      nextDates.push(i);
    }
    setNextDates(nextDates);
  };

  const isDisabledDate = (day: any) => {
    if (min && max) {
      const minDate = moment(min, "YYYY-MM-DD").format("L");
      const maxDate = moment(max, "YYYY-MM-DD").format("L");
      const currentDateCopy: any = new Date(currentDate);
      currentDateCopy.setDate(day);
      let newDate = moment(currentDateCopy, "YYYY-MM-DD").format("L");
      return newDate < minDate || newDate > maxDate;
    } else if (min) {
      const minDate = moment(min, "YYYY-MM-DD").format("L");
      const currentDateCopy = new Date(currentDate);
      currentDateCopy.setDate(day);
      let newDate = moment(currentDateCopy, "YYYY-MM-DD").format("L");
      return newDate < minDate;
    } else if (max) {
      const maxDate = moment(max, "YYYY-MM-DD").format("L");
      const currentDateCopy: any = new Date(currentDate);
      currentDateCopy.setDate(day);
      let newDate = moment(currentDateCopy, "YYYY-MM-DD").format("L");
      return newDate > maxDate;
    }
    return false;
  };

  return (
    <div className={`w-[280px]  overflow-hidden rounded-md  p-4    `}>
      <div className="mb-4 flex items-center justify-between ">
        <button className="outline-none" onClick={() => changeMonth(-1)}>
          <GrPrevious className={``} size={14} />
        </button>
        <h2 className={`text-lg font-bold `}>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button className="outline-none" onClick={() => changeMonth(1)}>
          <GrNext className={``} size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={`  text-center font-bold`}>
            {day}
          </div>
        ))}
        {prevDates?.map((date, index) => (
          <div
            className={`  cursor-default text-center`}
            key={index}
          >
            {date}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center ${
              selectedDate.day === day &&
              currentDate.getMonth() === new Date(`${selectedDate.month} 1, 2000`).getMonth() &&
              currentDate.getFullYear() === selectedDate.year
                ? ` `
                : ""
            } ${isDisabledDate(day) ? ` cursor-default` : `cursor-pointer rounded  `}`}
            onClick={() => {
              if (isDisabledDate(day)) {
                return;
              }
              handleDateSelect(day);
            }}
          >
            {day}
          </div>
        ))}
        {nextDates?.map((date, index) => (
          <div
            className={`cursor-default text-center`}
            key={index}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
