export const renderFocus = (focusItems) => {
    if (!focusItems) return '';
    return focusItems.map(item => \`
        <div class="clay-card">
            <h3 style="color: var(--primary); margin-bottom: 12px;">\${item.title}</h3>
            <p>\${item.description || 'Currently working on this.'}</p>
        </div>
    \`).join('');
};
