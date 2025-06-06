"use client"
import Card from "@/components/dashboard/Card";
import Sidebar from "@/components/dashboard/SideBar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Blog } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


interface SessionProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
    };
  };
}

function MainContent({ session }: SessionProps) {

  // FETCH ALL BLOGS
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs/blogs');
      setBlogs(response.data.blogs);
      setFilteredBlogs(response.data.blogs);
      //console.log(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);


  // Filter blogs based on the search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // FILTER BLOGS
  const handleFilterChange = (status: string) => {
    const filtered = blogs.filter(blog =>
      status === 'all' ? true : blog.status === status
    );
    setFilteredBlogs(filtered);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // DELETE BLOG
  const deleteBlog = async (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(`/api/blogs/blogs?id=${blogId}`);
        if (response.data.success) {
          //console.log('Blog deleted successfully');
          setBlogs(blogs.filter(blog => blog._id !== blogId));
          setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== blogId));
          alert("Blog deleted successfully");
        } else {
          console.error('Failed to delete blog:', response.data.msg);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const router = useRouter();


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [sidebarOpen, setSidebarOpen] = useState(false);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  return (
    <>
      <div className={`${sidebarOpen ? 'inset-0 z-40 bg-black/40 opacity-100 duration-1000 pointer-events-auto cursor-pointer' : 'pointer-events-none opacity-0'} fixed h-screen`} onClick={() => setSidebarOpen(false)}>
        <div
          className={`${sidebarOpen ? 'left-0 fixed'  : '-left-full'} top-0 duration-500 z-50 w-72 h-full bg-white dark:bg-neutral-900 shadow-xl cursor-auto`}
        >
          <Sidebar session={session} />
        </div>
      </div>


      <div className="px-4 py-10 sm:px-6 lg:px-4 lg:py-4 col-span-12 lg:col-span-10 overflow-y-scroll h-screen bg-slate-100 dark:bg-neutral-800">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="bg-transparent rounded-xl overflow-hidden">
                {/* Sub Header */}
                <div className="px-3 lg:px-6 py-4 grid gap-3 lg:flex lg:justify-between lg:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div className="flex gap-4 items-center">
                    <Button variant={'ghost'} size={'icon'} className="shrink-0 lg:mt-1.5 cursor-pointer" onClick={() => setSidebarOpen(true)}>
                      <TbLayoutSidebarLeftExpand className="size-8" />
                    </Button>
                    <h2 className="text-4xl font-bold text-black dark:text-white">Dashboard</h2>
                  </div>
                  <div className="flex items-center mt-5 lg:mt-0 gap-x-10 gap-y-4 lg:gap-10 flex-wrap">

                    <Button
                      onClick={() => router.push("/blogs/add_blog")}
                      className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md cursor-pointer bg-black backdrop-blur-lg px-6 py-2 h-10 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
                    >
                      <span className="text-sm">Add New Blog</span>
                      <div
                        className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
                      >
                        <div className="relative h-full w-10 bg-white/20"></div>
                      </div>
                    </Button>


                    {/* Search Blog */}
                    <div className="sm:col-span-1 order-last lg:order-2">
                      <label htmlFor="blogSearch" className="sr-only">Search Blog</label>
                      <div className="relative">
                        <Input
                          type="text"
                          id="blogSearch"
                          name="blogSearch"
                          className="py-2 px-3 ps-11 h-12 block w-full max-w-96 border-gray-200 bg-white shadow-none rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          placeholder="Search Blog"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                          <svg className="shrink-0 size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                      </div>
                    </div>
                    {/* End Search Blog */}

                    {/* Filter Blogs */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="py-2.5 px-5 inline-flex items-center cursor-pointer gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                        <LuListFilter className="shrink-0 size-3.5" />
                        Filter
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleFilterChange('all')}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange('publish')}>Published</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange('draft')}>Draft</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* End Filter Blogs */}

                    <ModeToggle />
                  </div>
                </div>
                {/* End Sub Header */}

                {/* Main Content Table */}
                {blogLoading ? (
                  <div className="flex items-center justify-center h-screen">
                    <Image src="/images/gif/loader.gif" alt="Loading" width={100} height={100} />
                  </div>
                ) : (

                  filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-10 bg-transparent min-h-screen h-full gap-10">
                      {
                        filteredBlogs.map((blog) => (
                          <Card key={blog._id} blog={blog} deleteBlog={deleteBlog} />
                        ))

                      }
                    </div>
                  ) : (
                    <div className="flex flex-col h-96 items-center w-full justify-center gap-4">
                      <p className="text-2xl text-gray-400">
                        You have not share any blog post yet
                      </p>
                      <p className="text-xl font-semibold text-orange-400 py-2 px-5 hover:bg-gray-100 dark:hover:bg-black rounded-lg">
                        <Link href="/blogs/add_blog">Add New Blog</Link>
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default MainContent