"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

const CusEditor = ({
  setContent,
  initialContent,
}: {
  setContent: (value: string) => void;
  initialContent?: string;
}) => {
  const editorRef = useRef<Editor | null>(null);

  return (
    <div className="mt-5 w-full">
      <Editor
        onInit={(_evt, editor) => (editorRef.current = editor)}
        apiKey="p38co52naao73hqsomwgihzxhuqt3ncyqh8tc9q96o8vk82x"
        init={{
          plugins: [
            "autolink",
            "charmap",
            "codesample",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "fullscreen",
            "preview",
            "help",
            "directionality",
          ],

          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap codesample | removeformat fullscreen preview help",
          menubar: "file edit view insert format tools table help",
          branding: false,
          directionality: "ltr",
          initialValue: "Start writing your blog here...",
        }}
        initialValue={initialContent || ""}
        onEditorChange={(content) => setContent(content)}
      />
    </div>
  );
};

export default CusEditor;
