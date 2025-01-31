"use client";

import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCopy, FaShareAlt, FaQrcode, FaEllipsisV, FaEye } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import AddEditUrlModal from "./AddEditUrlModal";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { addUrl, deleteUrl, fetchUrls, updateUrl } from "../../services/urlservice";
import { Url } from "@/interfaces/url";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

function UrlList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [showQRCode, setShowQRCode] = useState<string | null>(null);
    const itemsPerPage = 5;
    const router = useRouter();
    const [urls, setUrls] = useState<Url[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUrl, setEditingUrl] = useState<Url | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrls()
            .then((data) => {                
                setUrls(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching URLs:", error);
                toast.error("Failed to fetch URLs");
                setLoading(false);
            });
    }, []);

    // Filter URLs based on the search query
    const filteredUrls = urls.filter((url) =>
        url.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUrls = filteredUrls.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(`${shortUrl}`).then(() => {
            toast.success("URL copied to clipboard!");
        });
    };

    const handleShare = (shortUrl: string) => {
        if (navigator.share) {
            navigator.share({
                title: "Check out this link",
                url: `${shortUrl}`,
            });
        } else {
            toast.error("Sharing is not supported in your browser!");
        }
    };

    const handleDelete = async (_id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone! Do you want to delete this URL?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
    
        if (result.isConfirmed) {
            try {
                await deleteUrl(_id);
                setUrls((prevUrls) => prevUrls.filter((url) => url.shortId !== _id));
                toast.success("URL deleted successfully!");
            } catch (error) {
                toast.error("Error deleting URL. Please try again.");
            }
            setUrls(urls.filter((url) => url.shortId !== _id));
            toast.success("URL deleted successfully!");
        }
    };

    const handleUpdate = (_id: string) => {
        const urlToEdit = urls.find((url) => url._id === _id);
        if (urlToEdit) {
            setEditingUrl(urlToEdit);
            setIsModalOpen(true);
        }
    };

    const jumpToLogVisitors = (_id: string) => {
        router.push(`/log-visitors?id=${_id}`);
    };

    const handleAddOrUpdateUrl = async (newUrl: { longUrl: string; name: string; expiresAt?: Date }) => {
        try {
          if (editingUrl) {
            // Update URL
            const updatedUrl = await updateUrl(editingUrl.shortId, newUrl.longUrl, newUrl.name, newUrl.expiresAt);
            setUrls(urls.map((url) => (url._id === updatedUrl._id ? updatedUrl : url)));
            toast.success("URL updated successfully!");
          } else {
            // Add new URL
            const addedUrl = await addUrl(newUrl.longUrl, newUrl.name, newUrl.expiresAt);
            setUrls([addedUrl, ...urls]);
            toast.success("URL added successfully!");
          }
          setEditingUrl(null);
        } catch (error) {
          console.error("Error adding/updating URL:", error);
          toast.error("Failed to add/update URL");
        }
    };

    const exportDataPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("URL List", 10, 10);
        const tableData = urls.map((url) => [
            url.name,
            url.shortUrl,
            url.longUrl,
            url.createdAt,
        ]);
    
        (doc as any).autoTable({
            head: [['Name', 'Short URL', 'Original URL', 'Creation date']],
            body: tableData,
            startY: 20,
        });
    
        doc.save('url_list.pdf');
        toast.success("Data exported to PDF successfully!");
    };

    const exportDataExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(urls);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'URL List');
        XLSX.writeFile(workbook, 'url_list.xlsx');
        toast.success("Data exported to Excel successfully!");
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="container">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Short Links</h2>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => {
                            setEditingUrl(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Add New URL
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Export</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => exportDataPDF()}>
                                PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => exportDataExcel()}>
                                Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 container">
                    {Array.from({ length: itemsPerPage }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-full rounded-lg" />
                    ))}
                </div>
            ) : filteredUrls.length > 0 ? (
                <div>
                    <div className="space-y-4 container">
                        {currentUrls.map((url) => (
                            <div key={url._id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{url.name}</h3>
                                        <a href={`${url.shortUrl}`} className="text-blue-600 hover:underline">
                                            {url.shortUrl}
                                        </a>
                                        <p className="text-sm text-gray-500">{url.longUrl}</p>
                                        <p className="text-sm text-gray-500">{url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : '--'}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            className="p-2 text-gray-600 hover:text-blue-600 flex items-center"
                                            title="Visits"
                                        >
                                            <FaEye />
                                            <span className="ml-1">{url.clicks}</span>
                                        </button>
                                        <button
                                            onClick={() => handleCopy(url.shortUrl)}
                                            className="p-2 text-gray-600 hover:text-blue-600"
                                            title="Copy URL"
                                        >
                                            <FaCopy />
                                        </button>
                                        <button
                                            onClick={() => handleShare(url.shortUrl)}
                                            className="p-2 text-gray-600 hover:text-blue-600"
                                            title="Share URL"
                                        >
                                            <FaShareAlt />
                                        </button>
                                        <button
                                            onClick={() => setShowQRCode(showQRCode === url._id ? null : url._id)}
                                            className="p-2 text-gray-600 hover:text-blue-600"
                                            title="Show QR Code"
                                        >
                                            <FaQrcode />
                                        </button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 text-gray-600 hover:text-blue-600" title="More options">
                                                    <FaEllipsisV />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-md p-2">
                                                <DropdownMenuItem
                                                    onClick={() => handleUpdate(url._id)}
                                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                                >
                                                    Update
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => jumpToLogVisitors(url.shortId)}
                                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                                >
                                                    Log of URL Visitors
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(url.shortId)}
                                                    className="cursor-pointer p-2 hover:bg-gray-100 text-red-600"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <div className="flex items-center">
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                                            <span className="text-sm text-gray-600">
                                                {new Date(url.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {showQRCode === url._id && (
                                    <div className="mt-2">
                                        <QRCodeSVG value={`${url.shortUrl}`} size={128} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        {Array.from({ length: Math.ceil(filteredUrls.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-4 py-2 rounded-lg ${
                                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                } hover:bg-blue-600 hover:text-white`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="container">
                    <div className="flex justify-center items-center mb-4">
                        <Image
                            src="/assets/5191984.jpg"
                            alt="not found image"
                            width={300}
                            height={300}
                        />
                    </div>
                    <h3 className="flex justify-center items-center mb-4">Item not found "please add a new item using the button in the top"</h3>
                </div>
            )}

            <AddEditUrlModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingUrl(null);
                }}
                onAddOrUpdateUrl={handleAddOrUpdateUrl}
                editingUrl={editingUrl}
            />
        </div>
    );
}

export default UrlList;