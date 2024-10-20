export async function putSelectedQuestion(questions: number[], id: number) {
  try {
    await fetch(`http://localhost:4000/api/users/${id}/selectedQuestions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_questions: questions }),
    });
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function deleteSelectedQuestion(id: number) {
  try {
    await fetch(`http://localhost:4000/api/users/${id}/selectedQuestions`, {
      method: "DELETE",
    });
  } catch (error) {
    alert("Error deleting selected questions, please resubmit");
  }
}