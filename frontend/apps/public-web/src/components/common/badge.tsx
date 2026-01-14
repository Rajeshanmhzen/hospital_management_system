"use client"

import React from "react"

interface ComponentProps{
    text:string;
    bgColor:string;
    textColor:string;
    icon:React.ReactNode;
    borderRaduis:string;
}

const Badge:React.FC<ComponentProps> = ({bgColor,textColor,icon,borderRaduis, text}) => {
  return (
    <p className={`flex items-center justify-center ${bgColor} ${textColor} px-4 py-1 rounded-full ${borderRaduis} cursor-default gap-2 items-center justify-center w-fit`}>
        {icon}
        <span>{text}</span>
    </p>
  )
}

export default Badge