/**
 * UI Module
 * Handles dynamic rendering of tables, stats, cards, and toast notifications
 */

const UIModule = (() => {
  /**
   * Render file table rows
   * @param {Array} files - Array of file objects
   */
  function renderFileTable(files) {
    const tbody = document.getElementById('fileTableBody');
    if (!tbody) return;

    tbody.innerHTML = files.map(file => `
      <tr>
        <td>
          <div class="name">
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: linear-gradient(135deg, var(--accent), var(--accent-2));
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 12px;
            ">
              ${getFileInitials(file.name)}
            </div>
            <div>${file.name}</div>
          </div>
        </td>
        <td>${file.user || 'Unknown'}</td>
        <td>${formatFileSize(file.size)}</td>
        <td>${formatDate(file.createdAt)}</td>
        <td><span class="badge ${file.status === 'published' ? 'ok' : 'warn'}">
          ${file.status === 'published' ? 'منشور' : 'راجع'}
        </span></td>
        <td>
          <button class="icon-btn" onclick="UIModule.showFileActions(event, '${file.id}')">•••</button>
        </td>
      </tr>
    `).join('');

    updatePagination(files.length);
  }

  /**
   * Get file initials from filename
   * @param {string} filename - File name
   * @returns {string} Two-letter initials
   */
  function getFileInitials(filename) {
    const parts = filename.split('.');
    const name = parts[0].split('-').map(p => p[0]).join('').toUpperCase();
    return name.slice(0, 2) || 'F';
  }

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
  }

  /**
   * Format date
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG');
  }

  /**
   * Update pagination info
   * @param {number} total - Total files
   */
  function updatePagination(total) {
    const pagination = document.getElementById('filePagination');
    if (pagination) {
      pagination.textContent = `عرض 1-${Math.min(10, total)} من ${total}`;
    }
  }

  /**
   * Update statistics
   * @param {Object} stats - Statistics object
   */
  function updateStats(stats) {
    const elements = {
      'activeUsers': stats.activeUsers,
      'totalFiles': stats.totalFiles,
      'usedSpace': stats.usedSpace,
      'storagePercent': stats.storagePercent,
      'fileCount': stats.fileCount,
      'progressBar': stats.progressBar
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'progressBar') {
          el.style.width = value + '%';
        } else if (id === 'storagePercent') {
          el.textContent = value;
        } else {
          el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
      }
    });
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - 'success' or 'error'
   * @param {number} duration - Display duration in ms
   */
  function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Show file actions menu (placeholder)
   * @param {Event} event - Click event
   * @param {string} fileId - File ID
   */
  function showFileActions(event, fileId) {
    event.preventDefault();
    console.log('[v0] File actions for:', fileId);
    showToast('خيارات الملف قيد التطوير', 'info', 2000);
  }

  return {
    renderFileTable,
    formatFileSize,
    formatDate,
    updateStats,
    showToast,
    showFileActions
  };
})();
