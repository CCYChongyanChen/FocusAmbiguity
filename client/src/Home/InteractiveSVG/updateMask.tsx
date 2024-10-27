export async function putSelectedParts(masks: number[], id: number) {
  try {
    await fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}/selectedParts`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_parts_polygons: masks }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function putSelectedObject(masks: number[], id: number) {
  try {
    await fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}/selectedObjects`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_objects_polygons: masks }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}
