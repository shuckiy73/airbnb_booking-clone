// import React, {Component, useState, useEffect, Link} from "react";
// import DatePicker from "react-datepicker";
// import AirDatepicker from 'air-datepicker';
// import 'air-datepicker/air-datepicker.css';


// const CustomDatepicker = () => {
//     // const [startDate, setStartDate] = useState(new Date());
//     // const [endDate, setEndDate] = useState(new Date("2014/02/10"));
//     const [startDate, setStartDate] = useState(new Date());
//     return (
//         // <DatePicker selected={}
//         //             onSelect={handleDateSelect} //when day is clicked
//         //             onChange={handleDateChange} //only when value has changed
//         // />
//         <p></p>
//     );
//     //
//     //
//     //
//     //   <DatePicker
//     //     renderCustomHeader={({
//     //       monthDate,
//     //       customHeaderCount,
//     //       decreaseMonth,
//     //       increaseMonth,
//     //     }) => (
//     //       <div>
//     //         <button
//     //           aria-label="Previous Month"
//     //           className={
//     //             "react-datepicker__navigation react-datepicker__navigation--previous"
//     //           }
//     //           style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
//     //           onClick={decreaseMonth}
//     //         >
//     //           <span
//     //             className={
//     //               "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
//     //             }
//     //           >
//     //             {"<"}
//     //           </span>
//     //         </button>
//     //         <span className="react-datepicker__current-month">
//     //           {monthDate.toLocaleString("en-US", {
//     //             month: "long",
//     //             year: "numeric",
//     //           })}
//     //         </span>
//     //         <button
//     //           aria-label="Next Month"
//     //           className={
//     //             "react-datepicker__navigation react-datepicker__navigation--next"
//     //           }
//     //           style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
//     //           onClick={increaseMonth}
//     //         >
//     //           <span
//     //             className={
//     //               "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
//     //             }
//     //           >
//     //             {">"}
//     //           </span>
//     //         </button>
//     //       </div>
//     //     )}
//     //     selected={startDate}
//     //     onChange={(date) => setStartDate(date)}
//     //     monthsShown={2}
//     //   />
//     // );
// };


// export default CustomDatepicker;


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatepicker = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
        />
    );
};

export default CustomDatepicker;