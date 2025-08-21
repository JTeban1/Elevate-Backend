export const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidatesModel.findCandidates();
        res.json(candidates);
    } catch (error) {
        console.log('Error in controller', error);
        res.status(500).json({ error: 'Could not get candidates'});
    }
}

export const getAllCandidatesByFilters = async (req, res) => {
    try {
        const filters = {
            occupation : req.query.occupation,
            location : req.query.location,
            experience : req.query.experience,
            skills : Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills] ? req.query.skills : [],
            education : Array.isArray(req.query.education) ? req.query.education : [req.query.education] ? req.query.education : [],
            keywords : Array.isArray(req.query.keywords) ? req.query.keywords : [req.query.keywords] ? req.query.keywords : []
        }

        const candidatesByFilters = await candidatesModel.findCandidatesByFilters(filters);

        if(!candidatesByFilters){
            res.status(404).json({ error: 'Could not find candidates with those especifications'});
        }
    
        res.json(candidatesByFilters);

    } catch (error) {
        console.log('Error in controller', error);
        res.status(500).json({ error: 'Could not get candidates with those especifications'});
    }
}