import React from "react";
import Icons from "./Icons";

function Footer() {
  return (
    <>
      {/*Footer container*/}
      <div className="footer bg-neutral-800 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 z-10"></div>

      <footer className="bg-neutral-200 text-center text-white dark:bg-transparent z-2">
        <div className="mt-9">

            <Icons />
         
        </div>

        {/*Copyright section*/}
        <div className="bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-inherit dark:text-neutral-200 z-10">
          © 2023 Copyright:
          <a className="text-neutral-800 dark:text-neutral-400" href="#!">
            Ashish Kumar Mishra
          </a>
        </div>
      </footer>
    </>
  );
}
export default Footer;
