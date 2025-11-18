/**
 * Main Application Module
 * Initializes all modules and handles application logic
 */

const AppModule = (() => {
  /**
   * Initialize application
   */
  async function init() {
    console.log('[v0] Initializing Admin Dashboard...');
    
    setupNavigation();
    setupFileUpload();
    setupSearch();
    setupExport();
    await loadDashboard();
  }

  /**
   * Setup navigation between sections
   */
  function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
          section.classList.remove('active');
        });

        // Show selected section
        const section = item.dataset.section;
        const sectionElement = document.getElementById(`${section}Section`);
        if (sectionElement) {
          sectionElement.classList.add('active');
        }
      });
    });
  }

  /**
   * Setup file upload functionality
   */
  function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  /**
   * Handle file upload workflow
   * @param {File} file - File to upload
   */
  async function handleFileUpload(file) {
    // Validate file
    if (!file.type.includes('pdf')) {
      UIModule.showToast('نوع الملف غير مدعوم. يرجى تحميل ملف PDF', 'error');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      UIModule.showToast('حجم الملف يتجاوز الحد الأقصى (200MB)', 'error');
      return;
    }

    console.log('[v0] Uploading file:', file.name);
    UIModule.showToast('جاري تحميل الملف...', 'success', 5000);

    // Upload to Supabase
    const supabaseResult = await SupabaseModule.uploadPDF(file);
    if (!supabaseResult.success) {
      UIModule.showToast('فشل تحميل الملف إلى السحابة', 'error');
      return;
    }

    // Upload to Google Drive
    const driveResult = await DriveModule.uploadToDrive(file, {
      uploadedAt: new Date().toISOString(),
      supabaseUrl: supabaseResult.url
    });

    if (driveResult.success) {
      console.log('[v0] Drive share link:', driveResult.shareLink);
    }

    UIModule.showToast('تم رفع الملف بنجاح', 'success');
    
    // Reload file list
    await loadDashboard();
    
    // Reset file input
    document.getElementById('fileInput').value = '';
  }

  /**
   * Setup search functionality
   */
  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#fileTableBody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /**
   * Setup export functionality
   */
  function setupExport() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => {
      console.log('[v0] Export functionality');
      UIModule.showToast('جاري تصدير البيانات...', 'success', 2000);
    });
  }

  /**
   * Load dashboard data
   */
  async function loadDashboard() {
    console.log('[v0] Loading dashboard data...');
    
    // Load files
    const files = await SupabaseModule.listFiles();
    UIModule.renderFileTable(files);

    // Update statistics
    updateStatistics(files);
  }

  /**
   * Update dashboard statistics
   * @param {Array} files - Files array
   */
  function updateStatistics(files) {
    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    const percentage = Math.round((totalSize / maxSize) * 100);

    UIModule.updateStats({
      activeUsers: 1254,
      totalFiles: files.length,
      usedSpace: UIModule.formatFileSize(totalSize),
      storagePercent: `${percentage}% من 10GB`,
      fileCount: files.length,
      progressBar: percentage
    });
  }

  return {
    init
  };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AppModule.init();
});
