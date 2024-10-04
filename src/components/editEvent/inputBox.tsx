import React, { ReactNode, useId, useRef, useState } from "react";
import Toolbar from "../Editor/Toolbar";
import TextEditor from "../Editor/Editor";
import { useSelector } from "react-redux";
const InputBox = ({
  disabled = false,
  isTextArea = false,
  type,
  name,
  value,
  onChange,
  label,
  condition,
  multiple = false,
  accept = "",
  id,
  htmlFor,
  isEditing,
  icon:UploadIcon,
  maxChars
}: {
  icon?:React.ReactNode,
  disabled?: boolean;
  type: string;
  isTextArea?: boolean;
  name: string;
  value: string | number;
  onChange: any;
  label: string | ReactNode;
  accept?: string;
  multiple?: boolean;
  condition?: string[];
  id?: string;
  htmlFor?: string;
  isEditing?:boolean;
  maxChars?:number;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isEditorFocused,setIsEditorFocused] = useState(false);
  const activeTheme:string = useSelector((state:any)=>state.toggler.theme);
  function showToolBar(value:boolean){
    setIsEditorFocused(value)
  }
  const maxWords = maxChars ?? 300;
  return (
    <div className="flex flex-col gap-1">
      <p className={`font-medium ${Themes.inputBox?.label[activeTheme]}`}>{label}</p>
      {isTextArea ? (
        <textarea
          disabled={disabled}
          name={name}
          value={value}
          onChange={(e) => onChange(e)}
          className={`my_custom_scrollbar ${Themes.inputBox.textArea[activeTheme]} h-[200px] resize-none  rounded-md px-3  py-2 outline-none `}
        ></textarea>
      ) : type === "file" ? (
        <>
          <label
            htmlFor={htmlFor}
            className={`my_custom_scrollbar flex h-[35px] cursor-pointer items-center overflow-x-scroll whitespace-nowrap rounded-md ${Themes.inputBox.fileLabel[activeTheme]} border-2 border-dashed   px-3 outline-none`}
          >
            {value ? (
              value
            ) : (
              <div className="flex w-full items-center justify-center gap-2 ">
                {UploadIcon}
                Upload
              </div>
            )}
          </label>
          <input
            id={id}
            disabled={disabled}
            type={type}
            hidden
            name={name}
            onChange={(e) => {
              onChange(e);
            }}
            multiple={multiple}
            accept={accept}
            className="h-[35px] rounded-md px-3  outline-none  "
          />
        </>
      ) : type == "text" && name == "description" ? <>
        <Toolbar editorRef={editorRef} isEditorFocused={isEditorFocused} />
        <TextEditor
        isEditing={isEditing!}
        showToolBar={showToolBar}
          editorRef={editorRef}
          setWordCount={setWordCount}
          maxWords={maxWords}
          onChange={onChange}
          initialValue={value}
          name={name}
        />
        <span className='text-[11px] text-noble_black-400'> {wordCount}/{maxWords}</span>
      </> : (
        <>
          <input
            disabled={disabled}
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e)}
            onKeyUp={(e) => onChange(e)}
            className={`h-[35px] rounded-md ${Themes.inputBox.planeInput[activeTheme]} px-3  outline-none [appearance:textfield]   [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />
        </>
      )}
      {condition && (
        <div>
          {condition?.map((el, i) => (
            <p key={i} className="text-[11px] text-noble_black-400">
              {el}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputBox;
