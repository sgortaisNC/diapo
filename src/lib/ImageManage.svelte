<script lang="ts">
    export let file: { name: string; url: string };
    
    async function deleteImage(fileItem: { name: string; url: string }) {
        const response = await fetch(`/api/remove`, {
            method: 'DELETE',
            body: JSON.stringify({ url: fileItem.url })
        });
        const removed: { ok: boolean } = await response.json();
        if (removed.ok) {
            // Émettre un événement ou recharger la page
            window.location.reload();
        }
    }
</script>

<div class="item">
    <h2>{file.name}</h2>
    <img src={file.url} height="100" alt={file.name}>
    <button onclick={() => deleteImage(file)}>Delete</button>
</div> 