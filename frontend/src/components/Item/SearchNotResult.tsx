"use client";
import Image from "next/image";
import no_result from "@/assets/images/no_result.png";

const SearchNotResult = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image alt="no-result" src={no_result} width={600} height={400} />
      <p className="mt-4">Hệ thống không tìm thấy kết quả phù hợp!</p>
    </div>
  );
};

export default SearchNotResult;
