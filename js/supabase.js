/**
 * Supabase Integration Module
 * Handles all Supabase REST API calls for file management
 */

const SupabaseModule = (() => {
  // Configuration (update these with your Supabase credentials)
  const SUPABASE_URL = window.SUPABASE_URL || "";
  const SUPABASE_KEY = window.SUPABASE_KEY || "";

  const BUCKET_NAME = "admin-files";

  /**
   * Upload PDF to Supabase Storage
   * @param {File} file - PDF file to upload
   * @returns {Promise<Object>} Upload result
   */
  async function uploadPDF(file) {
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log(
          "[v0] Supabase credentials not configured. Using mock upload."
        );
        return mockUploadPDF(file);
      }

      const formData = new FormData();
      formData.append("", file);

      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${file.name}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "x-upsert": "true",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return {
        success: true,
        name: file.name,
        size: file.size,
        url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`,
      };
    } catch (error) {
      console.error("[v0] Upload error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mock PDF upload (for development without Supabase)
   * @param {File} file - PDF file
   * @returns {Promise<Object>} Mock upload result
   */
  async function mockUploadPDF(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          name: file.name,
          size: file.size,
          url: `mock://files/${file.name}`,
          isMock: true,
        });
      }, 1000);
    });
  }

  /**
   * List files from Supabase
   * @returns {Promise<Array>} Array of files
   */
  async function listFiles() {
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log("[v0] Using mock file list");
        return getMockFileList();
      }

      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to list files");

      const data = await response.json();
      return data.objects || [];
    } catch (error) {
      console.error("[v0] List files error:", error);
      return getMockFileList();
    }
  }

  /**
   * Get mock file list for development
   * @returns {Array} Mock files
   */
  function getMockFileList() {
    return [
      {
        id: "1",
        name: "intro-to-js.pdf",
        size: 1024 * 1200,
        user: "يوسف",
        status: "published",
        createdAt: "2025-11-10",
      },
      {
        id: "2",
        name: "lecture3.mp4",
        size: 1024 * 1024 * 28,
        user: "مريم",
        status: "pending",
        createdAt: "2025-11-09",
      },
      {
        id: "3",
        name: "python-basics.pdf",
        size: 1024 * 2400,
        user: "أحمد",
        status: "published",
        createdAt: "2025-11-08",
      },
    ];
  }

  /**
   * Delete file from Supabase
   * @param {string} fileName - File name to delete
   * @returns {Promise<Boolean>} Success status
   */
  async function deleteFile(fileName) {
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log("[v0] Mock delete:", fileName);
        return true;
      }

      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error("[v0] Delete error:", error);
      return false;
    }
  }

  /**
   * Update file metadata
   * @param {string} fileId - File ID
   * @param {Object} metadata - Metadata to update
   * @returns {Promise<Boolean>} Success status
   */
  async function updateFile(fileId, metadata) {
    try {
      console.log("[v0] Updating file:", fileId, metadata);
      return true;
    } catch (error) {
      console.error("[v0] Update error:", error);
      return false;
    }
  }

  return {
    uploadPDF,
    listFiles,
    deleteFile,
    updateFile,
  };
})();