import { useState } from "react";
import { Link } from "react-router-dom";
import { SideSheet } from "@douyinfe/semi-ui";
import { IconMenu, IconSetting, IconEdit, IconBookmark, IconHome, IconPlay } from "@douyinfe/semi-icons";
import { socials } from "../../utils/constants";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="py-6 px-12 sm:px-4 flex justify-between items-center border-b border-gray-100 bg-white backdrop-blur-sm">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="group flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors duration-300">
              SchemaBuilder
            </span>
          </Link>
          
          <div className="md:hidden flex gap-8">
            <Link
              className="text-lg font-medium hover:text-gray-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => { } } to={""}            >
              <IconSetting className="inline mr-2" /> Features
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
            </Link>
            <Link
              to="/editor"
              className="text-lg font-medium hover:text-gray-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <IconEdit className="inline mr-2" /> Editor
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
            </Link>
            <Link
              to="/templates"
              className="text-lg font-medium hover:text-gray-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <IconBookmark className="inline mr-2" /> Templates
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
            </Link>
            <Link
              to={socials.docs}
              className="text-lg font-medium hover:text-gray-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <IconHome className="inline mr-2" /> Docs
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center space-x-1 ms-12">
            <a
              title="Jump to Github"
              className="p-3 hover:bg-gray-100 transition-all duration-300 rounded-lg text-xl text-black hover:text-gray-600 transform hover:scale-110"
              href={socials.github}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github" />
            </a>
            <a
              title="Follow us on X"
              className="p-3 hover:bg-gray-100 transition-all duration-300 rounded-lg text-xl text-black hover:text-gray-600 transform hover:scale-110"
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-twitter-x" />
            </a>
            <a
              title="Join the community on Discord"
              className="p-3 hover:bg-gray-100 transition-all duration-300 rounded-lg text-xl text-black hover:text-gray-600 transform hover:scale-110"
              href={socials.discord}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-discord" />
            </a>
            
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-medium text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
        
        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          className="hidden md:inline-flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <IconMenu size="extra-large" />
        </button>
      </div>
      <hr className="border-gray-200" />
      <SideSheet
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-black">SchemaBuilder</span>
          </div>
        }
        visible={openMenu}
        onCancel={() => setOpenMenu(false)}
        width={window.innerWidth}
        className="bg-white"
      >
        <div className="bg-white p-4">
          <div className="space-y-2 mb-8">
            <Link
              className="flex items-center space-x-3 hover:bg-gray-50 block p-4 text-lg font-medium text-black transition-all duration-300 rounded-lg group"
              onClick={() => setOpenMenu(false)}
              to=""
            >
              <IconSetting size="large" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Features</span>
            </Link>
            <Link
              to="/editor"
              onClick={() => setOpenMenu(false)}
              className="flex items-center space-x-3 hover:bg-gray-50 block p-4 text-lg font-medium text-black transition-all duration-300 rounded-lg group"
            >
              <IconEdit size="large" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Editor</span>
            </Link>
            <Link
              to="/templates"
              onClick={() => setOpenMenu(false)}
              className="flex items-center space-x-3 hover:bg-gray-50 block p-4 text-lg font-medium text-black transition-all duration-300 rounded-lg group"
            >
              <IconBookmark size="large" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Templates</span>
            </Link>
            <Link
              to={socials.docs}
              onClick={() => setOpenMenu(false)}
              className="flex items-center space-x-3 hover:bg-gray-50 block p-4 text-lg font-medium text-black transition-all duration-300 rounded-lg group"
            >
              <IconHome size="large" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Documentation</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-600 mb-4">Connect with us</p>
            <div className="flex space-x-4">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="bi bi-github text-lg" />
              </a>
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="bi bi-twitter-x text-lg" />
              </a>
              <a
                href={socials.discord}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="bi bi-discord text-lg" />
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <Link
              to="/editor"
              onClick={() => setOpenMenu(false)}
              className="w-full flex items-center justify-center py-3 px-6 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              <IconPlay className="mr-2" /> Start Building Now
            </Link>
          </div>
        </div>
      </SideSheet>
    </>
  );
}
