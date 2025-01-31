"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLogs } from "@/services/logservice";


const VisitorsContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [currentPage, setCurrentPage] = useState(1);
    const [logs, setLogs] = useState<Visitor[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });

    useEffect(() => {
        if (id) {
            fetchLogs(id, currentPage)
                .then((result) => {
                    console.log(result);
                    
                    setLogs(result.data ?? []);
                    setPagination(result.pagination);
                })
                .catch((error) => {
                    console.error("Error fetching URLs:", error);
                });
        }
    }, [id, currentPage]);

    const paginate = (pageNumber : number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex justify-center items-center">Visitors Log for URL ID: {id}</h2>
            <div className="flex justify-between items-center flex-wrap">
                {logs.map((log, index) => (
                    <div key={index} className="mb-5 min-w-[250px]">
                        <p>Status: {log.Status ? "Accept" : "Failed"}</p>
                        <p>IP: {log.visitorIP}</p>
                        <p>Date: {new Date(log.createdAt).toLocaleDateString()}</p>
                        <p>Browser: {log.browser}</p>
                    </div>
                ))}
            </div>
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
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
            )}
        </div>
    );
};


const LogVisitores = () => {
    return (
        <Suspense fallback={<p>Loading visitors...</p>}>
            <VisitorsContent />
        </Suspense>
    );
};

export default LogVisitores;
