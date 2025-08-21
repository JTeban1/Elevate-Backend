export const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidatesModel.getCandidates();
        res.json(candidates);
    } catch (error) {
        console.log('Error in controller', error);
        res.status(500).json({ error: 'Could not get candidates'});
    }
}

export const getAllCandidatesByOccupation = async (req, res) => {
    try {
        const occupation = req.params.occupation;
        const candidatesByOccupation = await candidatesModel.getCandidatesByOccupation(occupation);

        if(!candidatesByOccupation){
            res.status(404).json({ error: 'Could not find candidates with that occupation'});
        }
        
        res.json(candidatesByOccupation);
    } catch (error) {
        console.log('Error in controller', error);
        res.status(500).json({ error: 'Could not get candidates by occupation'});
    }
}