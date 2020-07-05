#include <SKELETON.hpp>

SKELETON::SKELETON() 
{ 
    this->Type = "SKELETON";
}

SKELETON::SKELETON(Json::Value config)
{
    this->Type = "SKELETON";
}

Json::Value SKELETON::Export()
{
    Json::Value config;
    return config;
}

extern "C"
{
    ecs::Component *create_component(void *p)
    {
        if(p == nullptr)
        {
            return new SKELETON();
        }

        Json::Value *config = (Json::Value *)p;
        return new SKELETON(*config);
    }
}
