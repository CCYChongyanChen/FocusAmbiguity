export async function putSelectedMasks(masks: number[], id: number) {
  try {
    await fetch(`http://localhost:4000/api/users/${id}/selectedMasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_parts_polygons: masks }),
    });
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}
