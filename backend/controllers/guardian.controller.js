export const addGuardian = async (req, res) => {
    res.json({ message: "guardian added" });
  };
  
  export const getGuardians = async (req, res) => {
    res.json([]);
  };
  
  export const deleteGuardian = async (req, res) => {
    res.json({ message: "deleted" });
  };